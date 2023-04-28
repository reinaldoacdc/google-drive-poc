import React, { useEffect } from 'react'
import { gapi, loadAuth2 } from 'gapi-script'

export const UploadCard = (props) => {

	useEffect(() => {
		const script = document.createElement('script')

		script.src = "https://cdn.jsdelivr.net/gh/tanaikech/ResumableUploadForGoogleDrive_js/resumableupload2_js.min.js"
		script.async = true

		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	function run(obj) {
		const accessToken = gapi.auth.getToken().access_token // Please set access token here.
		const resource = {
			file: obj.target.files[0],
			accessToken: accessToken,
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
			if (res.status == "Uploading") {
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


	return (
		<div>
			<form>
				<input name="file" id="uploadfile" type="file" onChange={run} />
			</form>
			<div id="progress"></div>
		</div>
	)
}
