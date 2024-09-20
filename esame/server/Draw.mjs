import dayjs from 'dayjs';

/**
 * Constructor function to create a Draw object representing a lottery draw
 * @param {number} n1 first number extracted
 * @param {number} n2 second number extracted
 * @param {number} n3 third number extracted
 * @param {number} n4 fourth number extracted
 * @param {number} n5 fifth number extracted
 * @param {string|Date} timeStamp timestamp of the extraction 
 * @param {number|null} id id of the extraction if provided
 */
export default function Draw(n1, n2, n3, n4, n5, timeStamp, id = null) {
    this.id = id;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.n4 = n4; 
    this.n5 = n5;
    this.timeStamp = dayjs(timeStamp); 
}