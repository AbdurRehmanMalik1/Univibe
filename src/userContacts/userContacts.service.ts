import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { UserContacts } from './userContacts.entity';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class UserContactsService {
  constructor(
    @InjectRepository(UserContacts)
    private userContactsRepository: Repository<UserContacts>,
  ) {}

  // Method to add a contact with uniqueness validation
  async addContact(
    user_id: number,
    contact_type: string,
    contact_value: string,
  ): Promise<{ message: string }> {
    // Check if the contact already exists
    const existingContact = await this.userContactsRepository.findOne({
      where: {
        user: { user_id },
        contact_type,
        contact_value,
      },
    });

    if (existingContact) {
      throw new ConflictException(
        'Contact with this type and value already exists',
      );
    }

    // Add the new contact
    const newContact = this.userContactsRepository.create({
      user: { user_id } as User, // Creating a partial user entity reference
      contact_type,
      contact_value,
    });

    await this.userContactsRepository.save(newContact);
    return { message: 'Contact added successfully' };
  }

  // Method to get all contacts of a user
  async getAllContacts(user_id: number): Promise<UserContacts[]> {
    const contacts = await this.userContactsRepository.find({
      where: { user: { user_id } },
    });

    if (contacts.length === 0) {
      throw new NotFoundException('No contacts found for this user');
    }

    return contacts;
  }

  // Method to delete a contact by contact_type
  async deleteContactByType(
    user_id: number,
    contact_type: string,
  ): Promise<{ message: string }> {
    const contactToDelete = await this.userContactsRepository.findOne({
      where: { user: { user_id }, contact_type },
    });

    if (!contactToDelete) {
      throw new NotFoundException(
        `Contact of type '${contact_type}' not found for this user`,
      );
    }

    await this.userContactsRepository.remove(contactToDelete);
    return { message: 'Contact deleted successfully' };
  }


  /* 
    May not need this
  */
  async clearContactValue(
    user_id: number,
    contact_type: string,
  ): Promise<{ message: string }> {
    const contactToClear = await this.userContactsRepository.findOne({
      where: { user: { user_id }, contact_type },
    });

    if (!contactToClear) {
      throw new NotFoundException(
        `Contact of type '${contact_type}' not found for this user`,
      );
    }

    contactToClear.contact_value = null;

    await this.userContactsRepository.save(contactToClear);

    return { message: 'Contact value cleared successfully' };
  }
}
