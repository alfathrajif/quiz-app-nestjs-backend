import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateUserType,
  CurrentUserType,
  UserResponse,
  UserType,
} from 'src/model/user.model';
import * as bcrypt from 'bcrypt';
import { UsersUserService } from 'src/users/user/users-user.service';
import { Subscription } from 'src/model/subscription.model';
import { SubscriptionPlansUserService } from 'src/subscription-plans/user/subscription-plans-user.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class AdministratorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersUserService: UsersUserService,
    private readonly SubscriptionPlansUserService: SubscriptionPlansUserService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async findAll(currentUser: CurrentUserType): Promise<UserResponse[]> {
    const admins = await this.prismaService.user.findMany({
      where: {
        deleted_at: null,
        role: {
          name: 'admin',
        },
        NOT: {
          uuid: currentUser.uuid,
        },
      },
      include: {
        created_by: {
          select: {
            uuid: true,
            name: true,
            email: true,
            phone: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    admins.forEach((admin) => {
      delete admin.password;
    });

    return admins;
  }

  async create(
    currentUser: CurrentUserType,
    createAdministrator: CreateUserType,
  ): Promise<UserType> {
    try {
      const hashedPassword = await this.hashPassword(
        createAdministrator.password,
      );
      const newAdmin = await this.createAdmin(
        currentUser,
        createAdministrator,
        hashedPassword,
      );
      await this.createSubscription(newAdmin.uuid);

      return {
        uuid: newAdmin.uuid,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
        created_at: newAdmin.created_at,
        updated_at: newAdmin.updated_at,
      };
    } catch (error) {
      console.error('Error during create admin:', error);
      throw new Error('Failed to create admin.');
    }
  }

  // Utilities function for signup <--------------------------------------------

  private async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required.');
    }
    try {
      return await bcrypt.hash(password, 10);
    } catch {
      throw new Error('Failed to hash password.');
    }
  }

  private async createAdmin(
    currentUser: CurrentUserType,
    user: CreateUserType,
    hashedPassword: string,
  ) {
    try {
      return await this.usersUserService.createUser(currentUser, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: hashedPassword,
        role: {
          name: 'admin',
        },
        phone: user.phone,
      });
    } catch {
      throw new Error('Failed to create user.');
    }
  }

  private async createSubscription(userUuid: string): Promise<Subscription> {
    try {
      const plan = await this.SubscriptionPlansUserService.findOne('basic');
      if (!plan) {
        throw new Error('Subscription plan not found.');
      }

      const newSubscription: Subscription =
        await this.subscriptionsService.create({
          user_uuid: userUuid,
          subscription_plan_uuid: plan.uuid,
          end_date: new Date(
            new Date().setDate(new Date().getDate() + 100_000),
          ),
          started_date: new Date(),
          status: 'active',
        });

      return newSubscription;
    } catch {
      throw new Error('Failed to create subscription.');
    }
  }

  async softDelete(uuid: string) {
    await this.prismaService.user.update({
      where: {
        uuid: uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
