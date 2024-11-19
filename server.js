const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const cors = require('@koa/cors');


const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/jobtracker');

const applicationSchema = new mongoose.Schema({
  company: String,
  position: String,
  salary_range: String,
  status: String,
  notes: String,
});

const Application = mongoose.model('Application', applicationSchema);

router.get('/applications', async (ctx) => {
  const applications = await Application.find();
  ctx.body = applications;
});

router.post('/applications', async (ctx) => {
  const newApplication = new Application(ctx.request.body);
  await newApplication.save();
  ctx.body = newApplication;
});

router.put('/applications/:id', async (ctx) => {
  const updatedApplication = await Application.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
  ctx.body = updatedApplication;
});

router.delete('/applications/:id', async (ctx) => {
  await Application.findByIdAndDelete(ctx.params.id);
  ctx.body = { message: 'Application deleted' };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
  console.log('Server running on port 3001');
});


