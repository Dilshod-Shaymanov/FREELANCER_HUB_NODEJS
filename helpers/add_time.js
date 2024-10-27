const addMinute = (date,minut) => {
  return new Date(date.getTime() + minut * 60000);
};

export { addMinute };
