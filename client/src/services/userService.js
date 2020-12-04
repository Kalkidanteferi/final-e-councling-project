import axios from 'axios'
import * as shared from '../utils/shared'
export default class UserService {
    getUserById(id) {
        return axios
            .get(`${shared.base_url}/api/users/getuser/${id}`);
    }
}