export const localStorageService = {
  get(key: string) {
    try {
      const data = window.localStorage.getItem(key);

      // eslint-disable-next-line eqeqeq
      if (data != null) {
        return JSON.parse(data);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (error: Error) {
      console.error('Getting data from local storage failed with', error?.message);

      return null;
    }
  },
  set(key: string, data: unknown) {
    try {
      const stringifiedData = JSON.stringify(data);

      return window.localStorage.setItem(key, stringifiedData);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (error: Error) {
      console.error('Setting data to local storage failed with', error?.message);

      return null;
    }
  },
  remove(key: string) {
    try {
      return window.localStorage.removeItem(key);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (error: Error) {
      console.error('Removing data from local storage failed with', error?.message);

      return null;
    }
  },
};
