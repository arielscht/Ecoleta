import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi'

import './style.css';

interface Props {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState('');
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded]); 

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept='image/*'/>
            {
                isDragActive ?
                    <p><FiUpload/>Solte os arquivos aqui...</p> :
                    selectedFileUrl.length > 0 ?
                    <img src={selectedFileUrl} alt="Point picture"/> :
                    <p><FiUpload/>Arraste e solte o arquivo aqui, ou clique para selecionar arquivos</p>
            }
        </div>
    );
}

export default Dropzone;
