import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';


interface PostInfoProps {
  publication_date: string;
  author: string;
  duration?: number;
}


export function PostInfo({ publication_date, author, duration }: PostInfoProps) {

  return (
    <div className={commonStyles.infoContainer}>
      <div>
        <FiCalendar />
        <time>{publication_date}</time>
      </div>
      <div>
        <FiUser />
        <h5>{author}</h5>
      </div>
      <div>
        {duration !== undefined ? (
          <>
          <FiClock />
          <h5>{`${duration} min`}</h5>
          </>
        ) : (
          <div></div>
        )
        }
      </div>
    </div>
  );
}