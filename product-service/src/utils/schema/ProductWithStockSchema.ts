import * as yup from 'yup';

export const ProductWithStockSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    price:  yup.number().required().positive().integer(),
    count: yup.number().required().positive().integer(),
});