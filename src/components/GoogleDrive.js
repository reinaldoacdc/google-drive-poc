import { gapi, loadClientWithProps } from 'gapi-script'
import { useEffect, useState } from 'react'

export const GoogleDrive = (props) => {
	const [fileList, setFileList] = useState(null)

	useEffect(() => {
		const script = document.createElement('script')

		script.src = "https://cdn.jsdelivr.net/gh/tanaikech/ResumableUploadForGoogleDrive_js/resumableupload2_js.min.js"
		script.async = true

		document.body.appendChild(script)

		const setAuth2 = async () => {
			await loadClientWithProps(gapi, {
				apiKey: process.env.REACT_APP_API_KEY,
				scopes: process.env.REACT_APP_SCOPES,
				discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
			})
		}


		const listSharedFolder = async () => {
			const folderId = await getFolderId()
			console.log('folderId: ' + folderId)
			listFiles(folderId)
		}

		setAuth2()
		listSharedFolder()

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	async function run(obj) {
		const accessToken = gapi.auth.getToken().access_token // Please set access token here.
		const folderId = await getFolderId()
		const resource = {
			file: obj.target.files[0],
			accessToken: accessToken,
			folderId: folderId
		}
		resumableUpload(resource)
	}

	function resumableUpload(resource) {
		document.getElementById("progress").innerHTML = "Initializing."

		// eslint-disable-next-line no-undef
		const ru = new ResumableUploadToGoogleDrive2()
		ru.Do(resource, function (res, err) {
			if (err) {
				console.log(err)
				return
			}
			console.log(res)
			let msg = ""
			if (res.status === "Uploading") {
				msg =
					Math.round(
						(res.progressNumber.current / res.progressNumber.end) * 100
					) + "%"
			} else {
				msg = res.status
			}
			document.getElementById("progress").innerText = msg
		})
	}


	const getFolderId = async () => {
		console.log('list files: ', props)
		const gapiClient = await loadClientWithProps(window.gapi, {
			apiKey: process.env.REACT_APP_API_KEY,
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
		})
		let response
		try {
			console.log(`'${props.user.email}' in writers and name='AcdcGentrop'`)
			response = await window.gapi.client.drive.files.list({
				'q': `'${props.user.email}' in writers and name='AcdcGentrop'`,
				'fields': 'files(id, name)',
			})
		} catch (err) {
			console.log('erro ao tentar achar folderID: ', err.message)
			return
		}
		console.log('result: ', response.result)
		const files = response.result.files
		if (!files || files.length === 0) {
			console.log('No files found.')
			return
		}
		// Flatten to string to display
		console.log('folder: ', files[0])
		return files[0].id
	}


	const listFiles = async (folderId) => {
		const gapiClient = await loadClientWithProps(window.gapi, {
			apiKey: process.env.REACT_APP_API_KEY,
			clientId: process.env.REACT_APP_CLIENT_ID,
			scopes: process.env.REACT_APP_SCOPES,
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
		})
		let response
		try {
			response = await window.gapi.client.drive.files.list({
				'q': `'${folderId}' in parents`,
				'fields': 'files(id, name, mimeType)',
			})
		} catch (err) {
			console.log('erro: ', err.message)
			return
		}
		const files = response.result.files
		if (!files || files.length === 0) {
			console.log('No files found.')
			return
		}
		setFileList(files)
	}
	return (
		<div >
			<form>
				<input name="file" id="uploadfile" type="file" onChange={run} />
			</form>
			<div id="progress"></div>

			<h2>{props.user.email}</h2>


			<div>
				<ul>
					{
						fileList?.map((item, key) => {
							const dl = `https://drive.google.com/uc?export=download&id=${item.id}`
							return <h5><a href={dl} target="_blank" rel="noreferrer">{item.name}</a></h5>
						})
					}
				</ul>
			</div>



		</div>
	)
}