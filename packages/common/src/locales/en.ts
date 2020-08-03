import { PASSWORD_MIN, PASSWORD_MAX, LOGIN_ID_MIN, EMAIL_MAX, PUBLIC_NAME_MIN, PUBLIC_NAME_MAX, PRIVATE_NAME_MIN, PRIVATE_NAME_MAX, USER_NAME_MIN, USER_NAME_MAX, LIMIT_MIN, OFFSET_MIN } from "../constants";

export default {
  // ...route.action.field.rule
  validation: {
    auth: {
      register: {
        password: {
          required: 'A password is required',
          minLength: `Your password must be at least ${PASSWORD_MIN} characters`,
          maxLength: `Your password can be no more than ${PASSWORD_MAX} characters`,
          mismatch: 'You must enter the same password both times' // server
        },
      },
      login: {
        id: {
          required: 'Your username or email are required to login',
          minLength: `Your username or email must be at least ${LOGIN_ID_MIN} characters`,
          notFound: 'Please enter a valid username or email',
          wait: 'You have had too many failed attempts, please try again in 5 minutes' // server
        },
        password: {
          required: 'Your password is required',
          minLength: `Your password must be at least ${PASSWORD_MIN} characters`,
          maxLength: `Your password can be no more than ${PASSWORD_MAX} characters`,
          wrong: 'The password you entered is incorrect' // server
        }
      }
    },
    user: {
      email: {
        required: 'You must specify an email for your account',
        maxLength: `Your email address cannot exceed ${EMAIL_MAX} characters`,
        email: 'You must specify a valid email address',
        duplicate: 'There is already an account tied to this email' // server
      },
      public_name: {
        required: 'A public name is required',
        minLength: `Your public name must be at least ${PUBLIC_NAME_MIN} characters`,
        maxLength: `Your public name cannot exceed ${PUBLIC_NAME_MAX} characters`
      },
      private_name: {
        required: 'A private name is required',
        minLength: `Your private name must be at least ${PRIVATE_NAME_MIN} characters`,
        maxLength: `Your private name cannot exceed ${PRIVATE_NAME_MAX} characters`
      },
      user_name: {
        required: 'A user name is required',
        minLength: `Your user name must be at least ${USER_NAME_MIN} characters`,
        maxLength: `Your user name cannot exceed ${USER_NAME_MAX} characters`,
        duplicate: 'There is already an account with this username'
      },
    },
    generic: {
      id: {
        required: 'Non-empty IDs are required',
        uuid: 'Invalid ID format'
      },
      limit: {
        required: 'A valid limit is required when specified',
        min: `A limit cannot be less than ${LIMIT_MIN}`
      },
      offset: {
        required: 'A valid offset is required when specified',
        min: `An offset cannot be less than ${OFFSET_MIN}`
      },
      order: {
        invalid: 'A valid order is required'
      }
    }
  }
}