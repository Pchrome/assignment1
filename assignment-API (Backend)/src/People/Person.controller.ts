import { Request, Response, NextFunction } from 'express';
import { PeopleService } from './Person.service';
import { EmailService } from '../Email/PersonProcess.service';
import { Logger } from '../Logger/requestLogger';

const emailService = new EmailService(); /** Dependency Service class to send email upon adding of person */

const personService = new PeopleService(emailService);

export const getPersonById = async (req: Request, res: Response) => {
  Logger.info(`[${req.method}] ${req.url}`);
  const id = req.params.id;
  const person = await personService.getPersonById(id);
  if (!person) {
    Logger.error(`Person with ID ${id} not found.`);
    res.status(404).json({ error: 'Person not found' });

  } else {
    Logger.info(`Person with ID ${id} found.`);
    res.json({ data: person, status: "success" });
  }
};
  
export const addPerson = async (req: Request, res: Response)=> {
  const { email, phoneNumber } = req.body;
  const newPerson = await personService.addPerson(email, phoneNumber);
  Logger.info(`Person added: ${JSON.stringify(newPerson)}`);
  res.json({ data: newPerson, status: "success" });
};
  
export const deletePersonById = async (req: Request, res: Response)=> {
  const id = req.params.id;
  const person = await personService.getPersonById(id);
  personService.deletePersonById(id);
  res.sendStatus(200);
  }


/** Dummy Method to get all persons */
export const getAllPersons = async (req: Request, res: Response)=> {
  Logger.info(`[${req.method}] ${req.url}`);
  const allPersons = await personService.getAllPersons();
  Logger.info(`Retrieved all Peoples`);
  res.json(allPersons);
};

/** Helper function to check for duplicate emails, emails should be unique */
export const checkEmailExists = async (email: string) => {
  const existingPerson = await personService.getPersonByEmail(email);
  if (!existingPerson) {
    return false;
  } else {
    return true;
  }
};

/** Helper function to check ID Exists */
export const checkIdExists = async(id: string) => {
  const existingPerson = await personService.getPersonById(id);
  if (!existingPerson) {
    return false;
  } else {
    return true;
  }
};

export default {
    getPersonById,
    addPerson,
    deletePersonById,
    getAllPersons,
    checkEmailExists,
    checkIdExists,
  };
