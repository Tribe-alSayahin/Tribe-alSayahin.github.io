export interface Supporter {
  name: string;
  role: string;
  verified?: boolean;
}

export const SUPPORTERS_DATA: Supporter[] = [
  {
    name: 'خالد بن عيد بن بعاج ابن مسيلم',
    role: 'داعم توثيق الإرث والموروث التاريخي',
    verified: true,
  },
  ...Array.from({ length: 5 }, () => ({
    name: 'داعم مجهود التوثيق المالي واللوجستي',
    role: 'داعم مساهم في صون إرث القبيلة',
  })),
];
