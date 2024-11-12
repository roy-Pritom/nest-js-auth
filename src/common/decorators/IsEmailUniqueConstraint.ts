import { ValidatorConstraint} from "class-validator";
import { UserEntity } from "src/users/entities/user.entity";
import { getRepository } from "typeorm";

@ValidatorConstraint({ async: true })
export class IsEmailUnique  {
    async validate(email: string) {
        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne({ where: { email } });
        return !user; // Return true if no user is found (email is unique)
    }

    defaultMessage() {
        return 'Email $value is already in use. Please choose another email.';
    }
}