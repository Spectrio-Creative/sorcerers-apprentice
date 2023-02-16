function setUpObjectMethods() {
  if (!Object.entries)
    Object.entries = function (obj: { [key: string]: any }) {
      const ownProps = Object.keys(obj);
      let i = ownProps.length;
      const resArray = new Array(i); // preallocate the Array

      while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
      return resArray;
    };
}

export { setUpObjectMethods };
