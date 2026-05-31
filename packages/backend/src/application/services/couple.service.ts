import { Couple } from '../../domain/couple/couple.entity';
import { User } from '../../domain/user/user.entity';
import { CoupleRepositoryPort } from '../ports/couple-repository.port';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { WebSocketNotifierPort } from '../ports/websocket-notifier.port';

export class CoupleService {
  constructor(
    private readonly coupleRepo: CoupleRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
    private readonly wsNotifier: WebSocketNotifierPort,
  ) {}

  async invitePartner(inviterId: string, partnerEmail: string): Promise<Couple> {
    const inviter = await this.userRepo.findById(inviterId);
    if (!inviter) throw new Error('USER_NOT_FOUND');
    if (inviter.isInCouple()) throw new Error('USER_ALREADY_IN_COUPLE');

    const partner = await this.userRepo.findByEmail(partnerEmail);
    if (!partner) throw new Error('PARTNER_NOT_FOUND');
    if (partner.isInCouple()) throw new Error('PARTNER_ALREADY_IN_COUPLE');

    const existingCouple = await this.coupleRepo.findByUserId(inviterId);
    if (existingCouple) throw new Error('COUPLE_ALREADY_EXISTS');

    const couple = new Couple({
      user1Id: inviter.id.value,
      user2Id: partner.id.value,
      invitedBy: inviter.id.value,
    });

    await this.coupleRepo.save(couple);
    return couple;
  }

  async acceptInvitation(coupleId: string, userId: string): Promise<Couple> {
    const couple = await this.coupleRepo.findById(coupleId);
    if (!couple) throw new Error('COUPLE_NOT_FOUND');

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    couple.accept(userId);
    user.joinCouple(couple.id.value);

    const partnerId = couple.getPartner(userId);
    const partner = await this.userRepo.findById(partnerId);
    if (partner) {
      partner.joinCouple(couple.id.value);
      await this.userRepo.update(partner);
    }

    await this.coupleRepo.update(couple);
    await this.userRepo.update(user);

    return couple;
  }

  async dissolveCouple(coupleId: string, userId: string): Promise<void> {
    const couple = await this.coupleRepo.findById(coupleId);
    if (!couple) throw new Error('COUPLE_NOT_FOUND');

    couple.dissolve();

    const user1 = await this.userRepo.findById(couple.user1Id);
    const user2 = await this.userRepo.findById(couple.user2Id);

    user1?.leaveCouple();
    user2?.leaveCouple();

    await this.coupleRepo.update(couple);
    if (user1) await this.userRepo.update(user1);
    if (user2) await this.userRepo.update(user2);
  }

  async getCouple(coupleId: string): Promise<Couple | null> {
    return this.coupleRepo.findById(coupleId);
  }

  async getCoupleByUser(userId: string): Promise<Couple | null> {
    return this.coupleRepo.findByUserId(userId);
  }
}
