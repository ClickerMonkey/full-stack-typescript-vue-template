
import * as crypto from 'crypto';
import { fn, col, where, or, ModelIndexesOptions } from 'sequelize';
import { Request } from 'express';
import { Table, Column, DataType, PrimaryKey, Model, Default, AllowNull } from 'sequelize-typescript';
import { UserData, Auth, UserStatus } from 'common';




@Table({
  tableName: 'user',
  indexes: [
    { name: 'user_email', 
      type: 'UNIQUE', 
      fields: [fn('LOWER', col('email'))] },
    { name: 'user_user_name', 
      type: 'UNIQUE', 
      fields: [fn('LOWER', col('user_name'))] }
  ] as unknown as ModelIndexesOptions[]
})
export class User extends Model<User>
{

  @PrimaryKey
  @Default(fn('uuid_generate_v4'))
  @Column(DataType.UUID)
  public id: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  public user_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  public public_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  public private_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  public email: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  public salt: string;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  public password: string;

  @AllowNull(false)
  @Default(UserStatus.PENDING)
  @Column(DataType.SMALLINT)
  public status: UserStatus;

  @Column(DataType.DATEONLY)
  public birthdate: Date;

  @Column(DataType.DATE)
  public login_at: Date | null;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.SMALLINT)
  public login_attempts: number;

  @Column(DataType.DATE)
  public created_at: Date;

  public isValid(): boolean
  {
    return this.status <= UserStatus.VALID;
  }
  
  public async getAuth (): Promise<Auth>
  {
    const { id, email, user_name, private_name, public_name } = this;
    
    return { id, email, private_name, public_name, user_name };
  }

  public async getVisibleData (): Promise<UserData>
  {
    const { id, user_name: name, public_name, status, created_at } = this;

    return { id, name, public_name, status, created_at };
  }
  
  public static async byId (id: string): Promise<User | null> 
  {
    return await User.findOne({
      where: or(
        where(fn('LOWER', col('email')), fn('LOWER', id)),
        where(fn('LOWER', col('user_name')), fn('LOWER', id))
      )
    });
  }
  
  public static async byEmail (email: string): Promise<User | null> 
  {
    return await User.findOne({
      where: where(fn('LOWER', col('email')), fn('LOWER', email))
    });
  }
  
  public static async byUserName (user_name: string): Promise<User | null> 
  {
    return await User.findOne({
      where: where(fn('LOWER', col('user_name')), fn('LOWER', user_name))
    });
  }
  
  public static async fromSession (req: Request): Promise<User | null> 
  {
    return req.session && req.session.user
      ? await User.findByPk(req.session.user.id)
       : null;
  }
  
  public static salt (): string
  {
    return crypto.randomBytes(16).toString('hex');
  }
  
  public static hash (salt: string, password: string): string
  {
    const hashy = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

    return [salt, hashy].join('$');
  }

}