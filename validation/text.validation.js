import Joi from "joi";

export const inputValid = Joi.object({
  title: Joi.string().required().max(50),
  description: Joi.string().required().max(200),
});
