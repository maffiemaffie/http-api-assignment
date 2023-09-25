const respond = (request, response, content, code, type) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondJSONorXML = (request, response, acceptedTypes, code, { message, id }) => {
  let content;
  let type;
  if (acceptedTypes[0] === 'text/xml') {
    content = `
    <response>
        <message>${message}</message>
        ${id ? `<id>${id}<id>` : ''}
    </response>
    `;
    type = 'text/xml';
  } else {
    // if (id) content.id = id;
    content = JSON.stringify({
      message,
      id,
    });
    type = 'application/json';
  }
  return respond(request, response, content, code, type);
};

const getSuccess = (request, response, acceptedTypes) => {
  const content = {
    message: 'you did it :)',
  };

  respondJSONorXML(request, response, acceptedTypes, 200, content);
};

const getBadRequest = (request, response, acceptedTypes, params) => {
  const content = {
    message: 'thank you for having the parameters :)',
  };

  if (!params.valid || params.valid !== 'true') {
    content.message = "Missing 'valid' query parameter with value 'true'";
    content.id = 'badRequest';

    return respondJSONorXML(request, response, acceptedTypes, 400, content);
  }

  return respondJSONorXML(request, response, acceptedTypes, 200, content);
};

const getUnauthorized = (request, response, acceptedTypes, params) => {
  const content = {
    message: 'you are seeing this because you are authorized to :)',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    content.message = "Missing 'loggedIn' query parameter with value 'yes'";
    content.id = 'unauthorized';

    return respondJSONorXML(request, response, acceptedTypes, 401, content);
  }

  return respondJSONorXML(request, response, acceptedTypes, 200, content);
};

const getForbidden = (request, response, acceptedTypes) => {
  const content = {
    message: 'This is not for you.',
    id: 'forbidden',
  };

  return respondJSONorXML(request, response, acceptedTypes, 403, content);
};

const getInternal = (request, response, acceptedTypes) => {
  const content = {
    message: "couldn't fulfill request :(",
    id: 'internal',
  };

  return respondJSONorXML(request, response, acceptedTypes, 500, content);
};

const getNotImplemented = (request, response, acceptedTypes) => {
  const content = {
    message: "sorry not implemented yet :'(",
    id: 'notImplemented',
  };

  return respondJSONorXML(request, response, acceptedTypes, 501, content);
};

const getNotFound = (request, response, acceptedTypes) => {
  const content = {
    message: "couldn't find it :/",
    id: 'notFound',
  };

  return respondJSONorXML(request, response, acceptedTypes, 404, content);
};

module.exports = {
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
