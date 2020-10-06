import Axios from 'axios'
import ora from 'ora'

export async function loadRemoteFile<T>(name: string, url: string): Promise<T> {
  const spinner = ora(`Loading remote ${name} ...`).start()

  const { data } = await Axios.get<T>(url)

  spinner.stop()

  return data
}
