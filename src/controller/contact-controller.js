import contactService from '../service/contact-service.js';

const get = async (req, res, next) => {
  try {
    const result = await contactService.getMessage(req.params.contactId, req.user.id);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

const search = async (req, res, next) => {
  try{
    const result = await contactService.searchMessage(req.query, req.user.id);
    res.status(200).json({
        data: result.data,
        paging: result.paging
    });
  }catch (e){
    next(e);
  }
}

const store = async (req, res, next) => {
  try {
    const result = await contactService.storeMessage(req.body);
    res.status(201).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

const destroy = async (req, res, next) => {
  try{
    const result = await contactService.deleteMessage(req.params.contactId, req.user.id);
    res.status(200).json({
      message: 'OK'
    })
  }catch (e){
    next(e);
  }
}

export default {
  get,
  store,
  search,
  destroy
}
