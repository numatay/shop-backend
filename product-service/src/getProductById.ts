export const getProductById = async (_event, _context) => {
    console.log("Event:", _event);
    return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: _event,
    }, null, 2),
  };
}