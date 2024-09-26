import { v4 as uuidv4 } from 'uuid';

export function generateUuid(): any {
    return uuidv4();
}

export function convertToISODate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
}