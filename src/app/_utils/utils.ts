export const defaultPagination = {
    page: 1,
    count: 0,
    tableSize: 5,
    tableSizes: [5, 10, 50, 100],
  };


const map: Record<number, string> = {
    0: 'Integer',
    1: 'Float',
    2: 'Double',
    3: 'String',
    4: 'Decimal',
    5: 'Boolean',
    6: 'DateTime',
    7: ''
  };
  
export const numberToTypeMap = (type: number): string => {
  return map[type];
};