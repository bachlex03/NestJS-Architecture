import { User as UserEntity } from 'src/modules/user/entities/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
