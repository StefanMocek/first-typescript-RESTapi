import UserModel from "@/resources/user/user.model";
import token from "@/utils/token";

class UserService {
  private user = UserModel;

  /**
   * REgister a new user
   */

  public async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const user = await this.user.create({ name, email, password, role });
      const accesToken = token.createToken(user);
      return accesToken;
    } catch (error) {
      throw new Error("unable to create new user");
    }
  }

  /**
   * attempt to login a user
   */
  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) {
        throw new Error("Unable to find user with that email");
      }

      if (await user.isValidPassword(password)) {
        return token.createToken(user);
      } else {
        throw new Error("wrong credentials giver");
      }
    } catch (error) {
      throw new Error("Unable to login the uesr");
    }
  }
}

export default UserService;
