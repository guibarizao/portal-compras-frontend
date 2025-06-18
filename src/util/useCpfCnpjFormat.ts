const setSizeCgcCpf = (cgcCpf: string, preOrderType: string): string => {
  cgcCpf = cgcCpf.toString();
  if (preOrderType === 'FISICA') {
    for (let i = cgcCpf.split('').length; i < 11; i++) {
      cgcCpf = '0' + cgcCpf;
    }
    return cgcCpf;
  } else {
    for (let i = cgcCpf.split('').length; i < 14; i++) {
      cgcCpf = '0' + cgcCpf;
    }
    return cgcCpf;
  }
};

const useCpfCnpjFormat = () => {
  const formatCpf = (v: string): string => {
    v = setSizeCgcCpf(v, 'FISICA');
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
  };

  const formatCnpj = (v: string): string => {
    v = setSizeCgcCpf(v, 'JURIDICA');
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, '$1.$2'); //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, '$1-$2'); //Coloca um hífen depois do bloco de quatro dígitos
    return v;
  };

  return { formatCpf, formatCnpj };
};

export default useCpfCnpjFormat;
