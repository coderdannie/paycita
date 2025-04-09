export const useLogOut = () => {
  return () => {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };
};
