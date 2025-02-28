export const REGEX_TEMPLATE_DATA = [
  {
    label: 'Số điện thoại',
    name: 'phone',
    value: '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$',
  },
  {
    label: 'Email',
    name: 'email',
    value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  },
  {
    label: 'Ngày/tháng/năm',
    name: 'date',
    value: '^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)',
  },
];
