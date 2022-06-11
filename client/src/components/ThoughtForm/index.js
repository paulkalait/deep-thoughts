import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_THOUGHT } from '../../utils/mutations'
import { QUERY_THOUGHT, QUERY_ME } from '../../utils/queries' 

const ThoughtForm = () => {
    //line 27
    const [thoughtText, setText ] = useState('')

    const [characterCount, setCharacterCount] = useState(0)


    const handleChange = event =>{
        if(event.target.value.length <= 280 ){
            setText(event.target.value);
            setCharacterCount(event.target.value.length)
        }
    }

    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: {addThought}}){

            //could potentially not exist yet, so wrap in a try/catch
            try{
                //update me array's cache
                const { me } = cache.readQuery({query: QUERY_ME});
                cache.writeQuery({
                    query: QUERY_ME,
                    data: {me: { ...me, thoughts: [...me.thoughts, addThought]}},
                })
            }catch(e){
                    console.warn('First thought insertion by user!')
            }
            
            //udpate thoughts array's cache 
            const { thoughts } = cache.readQuery({query: QUERY_THOUGHT})

            cache.writeQuery({
                query: QUERY_THOUGHT,
                data: { thoughts: [addThought, ...thoughts]}
            })
        }
    })

    const handleFormSubmit = async event =>{
        event.preventDefault()

        try{ 
            //add thought to database
            await addThought({
                variables: { thoughtText}
            })
            setText('')
            setCharacterCount(0)
        }catch(e){
            console.error(e)
        }
     
    }



  return (
    <div>
    <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
      Character Count: {characterCount}/280
      {error && <span className='ml-2'>Something went wrong...</span> }
    </p>
    <form className="flex-row justify-center justify-space-between-md align-stretch"
    onSubmit={handleFormSubmit}
    >
      <textarea
        placeholder="Here's a new thought..."
        value={thoughtText}
        className="form-inddput col-12 col-md-9"
        onChange={handleChange}
      ></textarea>
      <button className="btn col-12 col-md-3" type="submit">
        Submit
      </button>
    </form>
  </div>
  )
}

export default ThoughtForm