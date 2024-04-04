const parkingFee = (startTime) => {
    const hourToAmountRate = 50; // 50 shillings per hour
    const startTimeDate = new Date(startTime);

    const timeDiffMs = Date.now() - startTimeDate.getTime();

    // Convert milliseconds to hours
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    let result = timeDiffHours * hourToAmountRate;
    

    // return the result rounded to two decimal places
    return Math.round(result * 10) / 10;
}

module.exports = { parkingFee };
