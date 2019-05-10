import { UPDATE_DATE } from '../util/constants';

export const updateDate = (newDate) => {
    return {
        type: UPDATE_DATE,
        payload: newDate
    }
} 

