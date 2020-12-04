import { extend } from 'vee-validate';

extend('positive', value => {
    return value >= 0;
});
