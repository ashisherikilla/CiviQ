import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

function ProjectCard({
  project,
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">
            {project.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {project.client || 'No client specified'}
          </p>
        </div>

        <Badge variant={project.status || 'Draft'}>
          {project.status || 'Draft'}
        </Badge>
      </div>

      <div className="mt-5 space-y-2.5 text-sm text-slate-500">
        {project.location && (
          <div className="flex items-center gap-2">
            <MapPin size={15} />
            <span>{project.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CalendarDays size={15} />
          <span>{project.createdAt || 'Recently created'}</span>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Link
          to={`/estimate/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open estimation
          <ArrowRight size={15} />
        </Link>
      </div>
    </Card>
  );
}

export default ProjectCard;