const hideComponent = (pathname: string): boolean => {
  return ["/"].includes(pathname);
};

export default hideComponent;
