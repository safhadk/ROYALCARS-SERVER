//booking id generator

export const Id = () => {
    let Id = '';
    for (let i = 0; i < 6; i++) {
      Id += Math.floor(Math.random() * 10);
    }
    return Id;
  };
  