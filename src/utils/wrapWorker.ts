// wrapper for workers
export const wrapWorker = async <T>(
  worker: Promise<typeof import('*?worker')>,
  args,
  cb?: (data: MessageEvent<T>) => void
): Promise<T | undefined> => {
  const SyncWorker = await worker;
  const syncWorker = new SyncWorker.default();

  return new Promise((resolve, reject) => {
    syncWorker.postMessage(args);

    syncWorker.onerror = () => {
      syncWorker.terminate();
    };
    if (cb) {
      syncWorker.onmessage = cb;
      resolve(undefined);
    } else {
      syncWorker.onmessage = ({ data }: MessageEvent<T>) => {
        resolve(data);
      };
    }

    syncWorker.onerror = () => {
      reject();
      syncWorker.terminate();
    };
  });
};
