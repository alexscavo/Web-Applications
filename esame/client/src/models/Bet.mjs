/**
 * Constructor function to create a Bet object representing a user's bet
 * @param {number} userId id of the user that made the bet
 * @param {number} drawId id of the draw in which the bet has been made
 * @param {number} n1 first number of the bet
 * @param {number} n2 second number of the bet
 * @param {number} n3 third number of the bet
 * @param {number} usedPoints points used for the bet
 * @param {number} wonPoints points won for the bet
 */
export default function Bet(userId, drawId, n1, n2, n3, usedPoints, wonPoints) {
    this.userId = userId;
    this.drawId = drawId;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.usedPoints = usedPoints;
    this.wonPoints = wonPoints;
}