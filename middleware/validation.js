const dataKeys = ["body", "params", "query", "headers"];

const validation = (schema) => {
  return (req, res, next) => {
    let errorsArr = [];

    dataKeys.forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });

        if (error?.details) {
          error.details.forEach((detail) => {
            errorsArr.push(detail);
          });
        }
      }
    });

    errorsArr.length ? res.status(400).json({ errors: errorsArr }) : next();
  };
};

export default validation;
