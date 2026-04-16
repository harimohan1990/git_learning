import { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Basics from '../components/tutorials/Basics';
import Branching from '../components/tutorials/Branching';
import Advanced from '../components/tutorials/Advanced';

const contentMap = {
  'what-is-git': <Basics />,
  'init-repo': <Basics />,
  'add-commit': <Basics />,
  branching: <Branching />,
  merge: <Branching />,
  rebase: <Branching />,
  remote: <Advanced />,
};

export default function Learn() {
  const [selected, setSelected] = useState('what-is-git');

  return (
    <div className="flex h-screen pt-[65px]">
      <Sidebar onSelect={setSelected} selectedSlug={selected} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {contentMap[selected] || <Basics />}
        </div>
      </main>
    </div>
  );
}
