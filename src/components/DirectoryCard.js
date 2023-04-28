import { gapi, loadClientWithProps } from 'gapi-script'
import React, { useEffect, useState } from 'react'

export const DirectoryCard = (props) => {
	const [fileList, setFileList] = useState(null)

	useEffect(() => {
		const setAuth2 = async () => {
			await loadClientWithProps(gapi, {
				apiKey: process.env.REACT_APP_API_KEY,
				discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://people.googleapis.com/$discovery/rest?version=v1']
			})
		}
		setAuth2()
		listFiles()
	}, [])


	const listFiles = async () => {
		console.log('list files: ', props)
		let response
		try {
			response = await window.gapi.client.drive.files.list({
				//'q': `'${props.user.email}' in writers and name='AcdcGentrop'`,
				'fields': 'files(id, name, exportLinks)',
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
		<div>
			<h2>{props.user.email}</h2>
			<div>
				<ul>
					{
						fileList?.map((item, key) => {
							const dl = `https://drive.google.com/uc?export=download&id=${item.id}`
							return <li><a href={dl} target="_blank" rel="noreferrer">{item.name}</a></li>

						})
					}
				</ul>
			</div>
		</div>
	)
}
