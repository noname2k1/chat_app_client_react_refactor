import { v4 as uuidv4 } from 'uuid';
export const profileArray = [
    {
        id: uuidv4(),
        name: 'name',
        class: 'name',
        type: 'text',
        label: 'Display Name',
        labelvn: 'Tên hiển thị',
    },
    {
        id: uuidv4(),
        name: 'dateofbirth',
        class: 'date-of-birth',
        type: 'date',
        label: 'Date of birth',
        labelvn: 'Ngày sinh',
    },
    {
        id: uuidv4(),
        name: 'gender',
        class: 'gender',
        type: 'select',
        options: ['male', 'female'],
        label: 'Gender',
        labelvn: 'Giới Tính',
    },
    {
        id: uuidv4(),
        name: 'address',
        class: 'address',
        type: 'text',
        label: 'Address',
        labelvn: 'Địa chỉ',
    },
    {
        id: uuidv4(),
        name: 'phone',
        class: 'phone',
        type: 'text',
        label: 'Phone',
        labelvn: 'Số điện thoại',
    },
];
