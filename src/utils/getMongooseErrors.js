const errorMessages = (error) => {
  console.log(error._message);
  console.log(
    Object.keys(error.errors)
      .map((key) => error.errors[key].properties.message)
      .toString()
  );

  return Object.keys(error.errors)
    .map((key) => error.errors[key].properties.message)
    .toString();
};

module.exports = errorMessages;
