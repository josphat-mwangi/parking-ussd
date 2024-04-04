const convertPointsOrAmount =(value, fromUnit, toUnit)=>{
    // set the conversion rates (1 point = 0.01 dollars)
     // set the conversion rates (2 point = 1 ksh)
    const pointToAmountRate = 1;
    const amountToPointRate = 1;
  
    let result;
  
    // check the input units and perform the appropriate conversion
    if (fromUnit === 'points' && toUnit === 'amount') {
      result = value * pointToAmountRate;
    } else if (fromUnit === 'amount' && toUnit === 'points') {
      result = value * amountToPointRate;
    } else {
      // if the units are invalid or the input value is not a number, return undefined
      return({
        status: false,
        statusCode: 400,
        message: "units are invalid or the input value is not a number"
      });
    }
  
    // return the result rounded to two decimal places
    return parseFloat(result.toFixed(2));
}

module.exports = { convertPointsOrAmount };