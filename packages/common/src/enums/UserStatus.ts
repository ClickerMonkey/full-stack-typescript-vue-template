
export enum UserStatus
{
  /**
   * Not verified yet
   */
  PENDING = 0,

  /**
   * Verified
   */
  VALID = 1,

  /**
   * An admin has blocked the party from the system
   */
  SUSPENDED = 2,

  /**
   * The party has closed their account
   */
  CLOSED = 3,
}