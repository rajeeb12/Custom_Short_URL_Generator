import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f'
const input = {
  width: 1024,
  height: 1024,
  prompt: 'self-portrait of a woman, lightning in the background',
  scheduler: 'K_EULER',
  num_outputs: 1,
  guidance_scale: 0,
  negative_prompt: 'worst quality, low quality',
  num_inference_steps: 4,
}

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
