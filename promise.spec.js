const OwnPromise = require("./promise");

const t = setTimeout;

describe("own promise", () => {
  let promise;
  let executer;
  const successResult = 42;
  const errorResult = 'error'
  beforeEach(() => {
    executer = jest.fn((resolve) => t(() => resolve(successResult), 150));
    promise = new OwnPromise(executer);
  });
  test("should exists and to be typeof function", () => {
    expect(OwnPromise).toBeDefined();
    expect(typeof OwnPromise).toBe("function");
  });

  test("instance should have methods: then, catch, finally", () => {
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
    expect(promise.catch).not.toBeUndefined();
  });

  test("OwnPromise should call executer function", () => {
    expect(executer).toHaveBeenCalled();
  });

  test("OwnPromise should get data in then block and chain them", async () => {
    const result = await promise.then((num) => num).then((num) => num * 2);
    expect(result).toBe(successResult * 2);
  });

  test('should catch error', () => {
    const errorExecuter = (_, reject) => t(()=> reject(errorResult), 150)
    const errorPromise = new OwnPromise(errorExecuter);

    return new Promise(resolve=>{
      errorPromise.catch(error=>{
        expect(error).toBe(errorResult);
        resolve();
      })
    })
  })
  test('call finally method', async()=>{
    const finallySpy = jest.fn(()=>{});
    await promise.finally(finallySpy)
    expect(finallySpy).toHaveBeenCalled()
  })
});
