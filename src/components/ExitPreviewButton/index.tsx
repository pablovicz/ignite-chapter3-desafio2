import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';

export function ExitPreviewButton(){
    return (
        <aside className={commonStyles.previewButton}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
    );
}