import { useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { classIf } from '../utils/htmlHelpers';
import { formatBytes } from '../utils/strings';

import './DropZone.scss'

export default function DropZone({onDrop}) {
    const [file, setFile] = useState();
    const [url, setUrl] = useState({});

    const handleDrop = acceptedFiles => {
        var file = acceptedFiles[0];
        if (file) {
            setFile(file);

            const urlreader = new FileReader()

            urlreader.onload = () => {
                setUrl(urlreader.result);
            }

            urlreader.readAsDataURL(file)
            onDrop(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop: handleDrop, multiple: false});


    return <div className={`drop-zone ${classIf(isDragActive, 'active')}`} {...getRootProps()}>
        <input {...getInputProps()} />

        {file 
        ? <div className="drop-zone__file">
            <img className="drop-zone__image" alt="To upload." src={url}/>
            <div className="drop-zone__meta-data">
                <label>Name</label>
                <span>{file.name}</span>
                <label>Size</label>
                <span>{formatBytes(file.size)}</span>
                <label>Type</label>
                <span>{file.type}</span>
            </div>
        </div>
        : <p>Drop image files here to upload, or click to browse.</p>
        }
    </div>
}