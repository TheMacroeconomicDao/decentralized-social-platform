export const sessionStorageService = {
  get(key: string) {
    try {
      const data = window.sessionStorage.getItem(key);

      // eslint-disable-next-line eqeqeq
      if (data != null) {
        return JSON.parse(data);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (error: Error) {
      console.error('Getting data from session storage failed with', error?.message);

      return null;
    }
  },
  set(key: string, data: unknown) {
    try {
      const stringifiedData = JSON.stringify(data);

      return window.sessionStorage.setItem(key, stringifiedData);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (error: Error) {
      console.error('Setting data to session storage failed with', error?.message);

      return null;
    }
  },
  remove(key: string) {
    try {
      return window.sessionStorage.removeItem(key);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (error: Error) {
      console.error('Removing data from session storage failed with', error?.message);

      return null;
    }
  },
};
